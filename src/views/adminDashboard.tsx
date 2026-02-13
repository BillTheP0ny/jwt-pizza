import React from 'react';
import View from './view';
import { useNavigate } from 'react-router-dom';
import NotFound from './notFound';
import Button from '../components/button';
import { pizzaService } from '../service/service';
import { Franchise, FranchiseList, Role, Store, User } from '../service/pizzaService';
import { TrashIcon } from '../icons';

interface Props {
  user: User | null;
}

export default function AdminDashboard(props: Props) {
  const navigate = useNavigate();

  // ---- existing franchise state ----
  const [franchiseList, setFranchiseList] = React.useState<FranchiseList>({ franchises: [], more: false });
  const [franchisePage, setFranchisePage] = React.useState(0);
  const filterFranchiseRef = React.useRef<HTMLInputElement>(null);

  // ---- NEW: user list state ----
  const [users, setUsers] = React.useState<User[]>([]);
  const [usersMore, setUsersMore] = React.useState(false);
  const [usersPage, setUsersPage] = React.useState(1);
  const usersLimit = 10;
  const filterUserRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    (async () => {
      if (!Role.isRole(props.user, Role.Admin)) return;
      setFranchiseList(await pizzaService.getFranchises(franchisePage, 3, '*'));
    })();
  }, [props.user, franchisePage]);

  // Load users whenever admin or page changes
  React.useEffect(() => {
    (async () => {
      if (!Role.isRole(props.user, Role.Admin)) return;

      const name = (filterUserRef.current?.value || '').trim();
      const r = await pizzaService.listUsers(usersPage, usersLimit, name ? `*${name}*` : '*');

      setUsers(r.users as User[]);
      setUsersMore(r.more);
    })();
  }, [props.user, usersPage]);

  function createFranchise() {
    navigate('/admin-dashboard/create-franchise');
  }

  async function closeFranchise(franchise: Franchise) {
    navigate('/admin-dashboard/close-franchise', { state: { franchise } });
  }

  async function closeStore(franchise: Franchise, store: Store) {
    navigate('/admin-dashboard/close-store', { state: { franchise, store } });
  }

  async function filterFranchises() {
    setFranchiseList(await pizzaService.getFranchises(franchisePage, 10, `*${filterFranchiseRef.current?.value}*`));
  }

  async function filterUsers() {
    setUsersPage(1);
    const name = (filterUserRef.current?.value || '').trim();
    const r = await pizzaService.listUsers(1, usersLimit, name ? `*${name}*` : '*');
    setUsers(r.users as User[]);
    setUsersMore(r.more);
  }

  async function deleteUser(userId: number) {
    await pizzaService.deleteUser(userId);

    // reload users after delete
    const name = (filterUserRef.current?.value || '').trim();
    const r = await pizzaService.listUsers(usersPage, usersLimit, name ? `*${name}*` : '*');
    setUsers(r.users as User[]);
    setUsersMore(r.more);
  }

  function roleText(u: User) {
    if (!u.roles?.length) return '';
    return u.roles.map((r) => r.role).join(', ');
  }

  let response = <NotFound />;
  if (Role.isRole(props.user, Role.Admin)) {
    response = (
      <View title="Mama Ricci's kitchen">
        <div className="text-start py-8 px-4 sm:px-6 lg:px-8">
          {/* ------------------- Franchises ------------------- */}
          <h3 className="text-neutral-100 text-xl" data-testid="franchises-heading">
            Franchises
          </h3>

          <div className="bg-neutral-100 overflow-clip my-4">
            <div className="flex flex-col">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="uppercase text-neutral-100 bg-slate-400 border-b-2 border-gray-500">
                        <tr>
                          {['Franchise', 'Franchisee', 'Store', 'Revenue', 'Action'].map((header) => (
                            <th key={header} scope="col" className="px-6 py-3 text-center text-xs font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      {franchiseList.franchises.map((franchise, findex) => {
                        return (
                          <tbody key={findex} className="divide-y divide-gray-200">
                            <tr className="border-neutral-500 border-t-2">
                              <td className="text-start px-2 whitespace-nowrap text-l font-mono text-orange-600">{franchise.name}</td>
                              <td className="text-start px-2 whitespace-nowrap text-sm font-normal text-gray-800" colSpan={3}>
                                {franchise.admins?.map((o) => o.name).join(', ')}
                              </td>
                              <td className="px-6 py-1 whitespace-nowrap text-end text-sm font-medium">
                                <button
                                  type="button"
                                  className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                                  onClick={() => closeFranchise(franchise)}
                                >
                                  <TrashIcon />
                                  Close
                                </button>
                              </td>
                            </tr>

                            {franchise.stores.map((store, sindex) => {
                              return (
                                <tr key={sindex} className="bg-neutral-100">
                                  <td className="text-end px-2 whitespace-nowrap text-sm text-gray-800" colSpan={3}>
                                    {store.name}
                                  </td>
                                  <td className="text-end px-2 whitespace-nowrap text-sm text-gray-800">{store.totalRevenue?.toLocaleString()} ₿</td>
                                  <td className="px-6 py-1 whitespace-nowrap text-end text-sm font-medium">
                                    <button
                                      type="button"
                                      className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                                      onClick={() => closeStore(franchise, store)}
                                    >
                                      <TrashIcon />
                                      Close
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        );
                      })}

                      <tfoot>
                        <tr>
                          <td className="px-1 py-1">
                            <input
                              type="text"
                              ref={filterFranchiseRef}
                              name="filterFranchise"
                              placeholder="Filter franchises"
                              className="px-2 py-1 text-sm border border-gray-300 rounded-lg"
                            />
                            <button
                              type="submit"
                              className="ml-2 px-2 py-1 text-sm font-semibold rounded-lg border border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                              onClick={filterFranchises}
                            >
                              Submit
                            </button>
                          </td>
                          <td colSpan={4} className="text-end text-sm font-medium">
                            <button
                              className="w-12 p-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-grey border-grey m-1 hover:bg-orange-200 disabled:bg-neutral-300"
                              onClick={() => setFranchisePage(franchisePage - 1)}
                              disabled={franchisePage <= 0}
                            >
                              «
                            </button>
                            <button
                              className="w-12 p-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-grey border-grey m-1 hover:bg-orange-200 disabled:bg-neutral-300"
                              onClick={() => setFranchisePage(franchisePage + 1)}
                              disabled={!franchiseList.more}
                            >
                              »
                            </button>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <Button className="w-36 text-xs sm:text-sm sm:w-64" title="Add Franchise" onPress={createFranchise} />
          </div>

          {/* ------------------- Users ------------------- */}
          <h3 className="text-neutral-100 text-xl mt-8" data-testid="users-heading">
            Users
          </h3>

          <div className="bg-neutral-100 overflow-clip my-4">
            <div className="p-2 flex items-center gap-2">
              <input
                ref={filterUserRef}
                type="text"
                placeholder="Filter users (name)"
                className="px-2 py-1 text-sm border border-gray-300 rounded-lg"
                data-testid="user-filter"
              />
              <button
                className="px-2 py-1 text-sm font-semibold rounded-lg border border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                onClick={filterUsers}
              >
                Submit
              </button>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="uppercase text-neutral-100 bg-slate-400 border-b-2 border-gray-500">
                <tr>
                  {['Name', 'Email', 'Roles', 'Action'].map((header) => (
                    <th key={header} scope="col" className="px-6 py-3 text-center text-xs font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id ?? `${u.email}`} className="hover:bg-gray-100">
                    <td className="px-6 py-2 text-sm text-gray-800">{u.name}</td>
                    <td className="px-6 py-2 text-sm text-gray-800">{u.email}</td>
                    <td className="px-6 py-2 text-sm text-gray-800">{roleText(u)}</td>
                    <td className="px-6 py-2 text-end">
                      <button
                        type="button"
                        className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                        onClick={() => deleteUser(u.id!)}
                        data-testid={`delete-user-${u.id ?? 'unknown'}`}
                        disabled={u.id == null}
                      >
                        <TrashIcon />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={4} className="text-end text-sm font-medium p-2">
                    <button
                      className="w-12 p-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-grey border-grey m-1 hover:bg-orange-200 disabled:bg-neutral-300"
                      onClick={() => setUsersPage(usersPage - 1)}
                      disabled={usersPage <= 1}
                    >
                      «
                    </button>
                    <button
                      className="w-12 p-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-grey border-grey m-1 hover:bg-orange-200 disabled:bg-neutral-300"
                      onClick={() => setUsersPage(usersPage + 1)}
                      disabled={!usersMore}
                    >
                      »
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </View>
    );
  }

  return response;
}
